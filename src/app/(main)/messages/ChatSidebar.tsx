const ChatSidebar: React.FC<ChatSidebarProps> = ({ open, onClose, className }) => {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const { channel } = useChatContext();

  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries(["unread-messages-count"]);
    }
  }, [channel?.id, queryClient]);

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose]
  );

  return (
    <div
      className={cn(
        "flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
        className // Apply the className here
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{ type: "messaging", members: { $in: [user.id] } }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: { filters: { members: { $in: [user.id] } } }
          }
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
};
